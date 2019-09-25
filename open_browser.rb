#!/usr/bin/env ruby

require 'open3'
require 'tmpdir'
require 'fileutils'


puts "\n\nOpening chrome browser...\n"

# launch generic chrome using a temp dir for user-data-dir
Dir.mktmpdir do |tmp_dir|
	Open3.popen2e(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "--headless",
      "--remote-debugging-port=9222",
      "--no-first-run",
      "--no-default-browser-check",
      "--user-data-dir=#{tmp_dir}"
  ) do |stdin, stdout_and_stderr, wait_thr|
		stdout_and_stderr.each do |line|
      if line =~ /(ws:\/\/(.+):\d+\/.+$)/
        url = $1.sub($2, 'host.docker.internal')
        puts "    DevTools listening on: #{url}"
        puts "\n    Exit browser with 'kill #{wait_thr.pid}'\n\n"
        STDOUT.flush
        File.open('.dev_tools_url', 'w') do |file|
          file.write(url)
        end
      else
        puts line
      end
	  end
	end
end

puts "\n    browser closed"
FileUtils.rm('.dev_tools_url')
