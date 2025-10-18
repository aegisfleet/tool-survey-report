---
layout: home
title: "調査レポートサイト"
---

# 調査レポートサイトへようこそ

このサイトでは、調査チームが作成した各種レポートを閲覧できます。

## 最新のレポート

{% assign latest_reports = site.reports | sort: 'date' | reverse | limit: 5 %}
{% for report in latest_reports %}
- [{{ report.title }}]({{ report.url }}) - {{ report.date | date: "%Y年%m月%d日" }}
{% endfor %}

## すべてのレポートを見る

[レポート一覧ページ](/reports/)でより多くのレポートを閲覧できます。