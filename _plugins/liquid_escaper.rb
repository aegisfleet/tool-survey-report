module LiquidEscaper
  Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc|
    # Only process markdown files
    next unless doc.respond_to?(:extname) && doc.extname.downcase == '.md'

    # Replace Liquid syntax characters with Liquid raw tags to prevent syntax errors
    # while preserving original output in the generated HTML.
    if doc.content
      # Use temporary placeholders to avoid recursive replacements
      content = doc.content.gsub('{{', 'TEMP_DOUBLE_LEFT_CURLY')
                           .gsub('}}', 'TEMP_DOUBLE_RIGHT_CURLY')
                           .gsub('{%', 'TEMP_PERCENT_LEFT_CURLY')
                           .gsub('%}', 'TEMP_PERCENT_RIGHT_CURLY')

      doc.content = content.gsub('TEMP_DOUBLE_LEFT_CURLY', '{% raw %}{{{% endraw %}')
                           .gsub('TEMP_DOUBLE_RIGHT_CURLY', '{% raw %}}}{% endraw %}')
                           .gsub('TEMP_PERCENT_LEFT_CURLY', '{% raw %}{%{% endraw %}')
                           .gsub('TEMP_PERCENT_RIGHT_CURLY', '{% raw %}%}{% endraw %}')
    end
  end
end
