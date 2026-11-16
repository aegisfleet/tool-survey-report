# frozen_string_literal: true

# レポート一覧から「タグ索引」「関連レポート索引」「類似レポート索引」を1回だけ構築する。
#
# これまで tags/index.html ではタグごとに site.reports を全走査し、
# _includes/related-tools.html と _layouts/report.html ではレポートページごとに
# site.reports を全走査していた（O(N^2) の Liquid ループ）。ビルド時に Ruby 側で
# 索引を作ることで、ページ数・レポート数が増えてもビルド時間が急増しないようにする。
module SiteIndexes
  module_function

  def report_docs(site)
    collection = site.collections["reports"]
    collection ? collection.docs : []
  end

  # { "タグ名" => [doc, ...] } を1パスで作り、タグ別の表示用データに変換する
  def build_tags_index(reports)
    tags = {}

    reports.each do |doc|
      tag_names(doc).each do |name|
        entry = tags[name] ||= { "name" => name, "count" => 0, "recent" => [] }
        entry["count"] += 1
        entry["recent"] << doc
      end
    end

    tags.values.map do |entry|
      recent = entry["recent"]
               .sort_by { |doc| doc.data["last_updated"].to_s }
               .reverse
               .first(3)
               .map { |doc| report_summary(doc) }

      { "name" => entry["name"], "count" => entry["count"], "recent" => recent }
    end.sort_by { |entry| entry["name"] }
  end

  # { "tool_name" => { parent:, children:, siblings: } } を構築する
  def build_related_tools_index(reports)
    by_name = {}
    reports.each do |doc|
      name = doc.data["tool_name"].to_s
      by_name[name] = doc unless name.empty?
    end

    children_of = {} # 親ツール名 => [子レポート]
    parents_of = {}  # 子ツール名 => [親レポート]

    reports.each do |doc|
      relationships = doc.data["relationships"]
      next unless relationships.is_a?(Hash)

      parent_name = relationships["parent"].to_s
      (children_of[parent_name] ||= []) << doc unless parent_name.empty?

      Array(relationships["children"]).each do |child|
        child_name = child.to_s
        (parents_of[child_name] ||= []) << doc unless child_name.empty?
      end
    end

    index = {}

    reports.each do |doc|
      name = doc.data["tool_name"].to_s
      next if name.empty?

      relationships = doc.data["relationships"]
      relationships = {} unless relationships.is_a?(Hash)

      parent = resolve(by_name, relationships["parent"])
      # 親が未指定で children も未定義なら、親として宣言しているレポートを逆引きする
      if parent.nil? && relationships["children"].nil?
        candidates = parents_of[name]
        parent = candidates.last unless candidates.nil? || candidates.empty?
      end

      child_docs = Array(relationships["children"]).map { |child| resolve(by_name, child) }.compact
      child_docs.concat(children_of[name] || [])
      child_docs.reject! { |child| child.equal?(doc) }

      sibling_docs = Array(relationships["related_tools"]).map { |tool| resolve(by_name, tool) }.compact

      index[name] = {
        "parent" => summarize(parent),
        "children" => dedupe_summaries(child_docs),
        "siblings" => dedupe_summaries(sibling_docs),
      }
    end

    index
  end

  def tag_names(doc)
    Array(doc.data["tags"]).map { |tag| tag.to_s.strip }.reject(&:empty?).uniq
  end

  # タグ一致度の高い類似レポートを事前計算する。
  # これまで _layouts/report.html がページごとに site.reports 全件とタグを突き合わせていた
  # （O(N^2) の Liquid ループ）のを、ビルド時に1回だけ計算する。
  def build_similar_reports_index(reports)
    tags_by_url = {}
    reports.each { |doc| tags_by_url[doc.url.to_s] = tag_names(doc) }

    index = {}

    reports.each do |doc|
      page_tags = tags_by_url[doc.url.to_s]
      next if page_tags.empty?

      scored = []

      reports.each do |other|
        next if other.equal?(doc)

        other_tags = tags_by_url[other.url.to_s]
        next if other_tags.empty?

        common = (page_tags & other_tags).size
        next if common.zero?

        ratio = common * 100 / page_tags.size
        summary = summarize(other)
        summary["match_ratio"] = ratio
        summary["common_count"] = common

        # 元の Liquid 実装と同じソートキー（一致率2桁ゼロ詰め + 共通タグ数 + ツール名）
        padded_ratio = ratio < 10 ? "0#{ratio}" : ratio.to_s
        scored << ["#{padded_ratio}.#{common}.#{summary['tool_name']}", summary]
      end

      index[doc.url.to_s] = scored.sort_by(&:first).reverse.first(5).map(&:last)
    end

    index
  end

  def resolve(by_name, value)
    return nil if value.nil?

    by_name[value.to_s]
  end

  def report_summary(doc)
    {
      "tool_name" => doc.data["tool_name"] || doc.data["title"],
      "url" => doc.url,
      "last_updated" => doc.data["last_updated"].to_s,
    }
  end

  def summarize(doc)
    return nil if doc.nil?

    quick_summary = doc.data["quick_summary"]
    quick_summary = {} unless quick_summary.is_a?(Hash)
    evaluation = doc.data["evaluation"]
    evaluation = {} unless evaluation.is_a?(Hash)

    {
      "tool_name" => doc.data["tool_name"] || doc.data["title"],
      "title" => doc.data["title"],
      "url" => doc.url,
      "description" => doc.data["description"],
      "score" => evaluation["score"],
      "is_oss" => quick_summary["is_oss"] == true,
      "has_free_plan" => quick_summary["has_free_plan"] == true,
      "last_updated" => doc.data["last_updated"].to_s,
    }
  end

  def dedupe_summaries(docs)
    seen = {}
    docs.each_with_object([]) do |doc, result|
      next if doc.nil?

      key = doc.url.to_s
      next if seen[key]

      seen[key] = true
      result << summarize(doc)
    end
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  reports = SiteIndexes.report_docs(site)
  site.data["tags_index"] = SiteIndexes.build_tags_index(reports)
  site.data["related_tools_index"] = SiteIndexes.build_related_tools_index(reports)
  site.data["similar_reports_index"] = SiteIndexes.build_similar_reports_index(reports)
end
