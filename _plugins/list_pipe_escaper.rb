module ListPipeEscaper
  Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc|
    # Only process markdown files
    next unless doc.respond_to?(:extname) && doc.extname.downcase == '.md'

    lines = doc.content.split("\n", -1)
    in_code_block = false

    new_lines = lines.map do |line|
      # Check for code block toggle (fenced code blocks)
      if line.strip.start_with?('```')
        in_code_block = !in_code_block
        next line
      end

      # Process only if NOT in a code block and line is a list item
      if !in_code_block && line.match?(/^\s*[-*+]\s+/)
        # Regex explanation:
        # (`+.*?\1) : Matches content specifically enclosed in backticks (inline code)
        #             `+ matches one or more backticks
        #             .*? matches any character non-greedily
        #             \1 matches the same number of backticks as the start
        # (|)       : Matches the pipe character
        line.gsub(/(`+.*?\1)|(\|)/) do |match|
          if $1
            match # Return the code span as is
          else
            '&#124;' # Replace the pipe with HTML entity
          end
        end
      else
        line
      end
    end

    doc.content = new_lines.join("\n")
  end
end
