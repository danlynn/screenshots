#!/usr/bin/env ruby

require 'open3'

unless File.exists?('.dev_tools_url')
  fork do
    Open3.popen2e("./open_browser.rb") do |stdin, stdout_and_stderr, wait_thr|
      stdout_and_stderr.each do |line|
        puts "DEVTOOLS: #{line}"
      end
    end
    exit 0
  end
end

`touch .bash_history`
puts "\n\nLaunching bash\n\n"
exec("docker-compose run node bash")
