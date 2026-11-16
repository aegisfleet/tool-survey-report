# frozen_string_literal: true

require "digest"

# CSS/JS のキャッシュバスター用バージョンを、フロントエンド資産の内容から算出する。
#
# これまでは site.time（ビルド時刻）を付与していたため、日次のレポート追加でも
# 全リピーターの CSS/JS キャッシュが破棄されていた。資産の中身が変わったときだけ
# バージョンが変わるようにして、不要な再ダウンロードを避ける。
module AssetVersion
  SOURCE_GLOBS = [
    "assets/**/*.js",
    "assets/**/*.css",
    "_sass/**/*.scss",
  ].freeze

  module_function

  def compute(site)
    digest = Digest::SHA1.new

    SOURCE_GLOBS.each do |glob|
      Dir.glob(File.join(site.source, glob)).sort.each do |path|
        digest << File.basename(path)
        digest << File.binread(path)
      end
    end

    digest.hexdigest[0, 12]
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  site.data["asset_version"] = AssetVersion.compute(site)
end
