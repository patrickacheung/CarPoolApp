# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end
execute 'apt_update' do
  command 'apt-get update'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
package "nginx"
package "ack-grep"
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
execute 'ntp_restart' do
  command 'service ntp restart'
end

# nodejs and npm setup.
execute 'nodejs_repo_script' do
  command 'curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -'
end
apt_package 'nodejs'

# Shell and env variables when logged in.
# https://stackoverflow.com/a/36896159
sys_env_file = Chef::Util::FileEdit.new('/etc/environment')
{
  'NPM_CONFIG_PREFIX' => '/home/vagrant/.npm-global',
}.each do |name, val|
  sys_env_file.insert_line_if_no_match /^#{name}\=/, "#{name}=\"#{val}\""
  sys_env_file.write_file
end
sys_env_file = Chef::Util::FileEdit.new('/home/vagrant/.profile')
{
  'export PATH' => '/home/vagrant/.npm-global/bin:$PATH',
}.each do |name, val|
  sys_env_file.insert_line_if_no_match /^#{name}\=/, "#{name}=\"#{val}\""
  sys_env_file.write_file
end

# Install Angular.
execute 'install_angular' do
  user 'vagrant'
  environment ({'HOME' => '/home/vagrant', 'USER' => 'vagrant', 'NPM_CONFIG_PREFIX' => '/home/vagrant/.npm-global'}) 
  command 'npm install -g @angular/cli'
end
