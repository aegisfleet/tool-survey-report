module ListPipeEscaper
  Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc|
    # Only process markdown files
    next unless doc.respond_to?(:extname) && doc.extname.downcase == '.md'

    lines = doc.content.split("\n", -1)
    in_code_block = false

    # Optimization: Use map! to modify the array in place, avoiding allocation of a new array
    lines.map! do |line|
      # Check for code block toggle (fenced code blocks)
      if line.match?(/^\s*```/)
        in_code_block = !in_code_block
        next line
      end

      # Process only if NOT in a code block and line is a list item
      if !in_code_block && line.match?(/^\s*[-*+]\s+/)
        # Regex explanation:
        # ((`+).*?\2) : Matches content specifically enclosed in backticks (inline code)
        #               (`+) matches one or more backticks (Group 2)
        #               .*? matches any character non-greedily
        #               \2 matches the same backticks as Group 2
        # (|)         : Matches the pipe character (Group 3)

        # Optimization: Use gsub! to modify the string in place if possible
        # gsub! returns nil if no changes are made, so we fallback to line
        line.gsub!(/((`+).*?\2)|(\|)/) do |match|
          if $1
            match # Return the code span as is (Group 1 matched)
          else
            '&#124;' # Replace the pipe with HTML entity
          end
        end || line
      else
        line
      end
    end

    doc.content = lines.join("\n")
  end
end
