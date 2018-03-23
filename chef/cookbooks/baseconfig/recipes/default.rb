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
#package "git"
package "ack-grep"
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
execute 'ntp_restart' do
  command 'service ntp restart'
end
# Reconfigure nginx for our application.
cookbook_file '/etc/nginx/sites-available/default' do
  source 'nginx-carpoolapp'
  action :create
end
# Restart nginx service to reload config.
service 'nginx' do
  action :restart
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
#execute 'install_angular' do
#  user 'vagrant'
#  environment ({'HOME' => '/home/vagrant', 'USER' => 'vagrant', 'NPM_CONFIG_PREFIX' => '/home/vagrant/.npm-global'}) 
#  command 'npm install -g @angular/cli'
#end

# https://stackoverflow.com/q/40637033
#npmpath = "/home/vagrant/.npm-global"
#ENV['PATH'] = "#{ENV['PATH']}:" + npmpath
#execute 'test_angular' do
#  command '/home/vagrant/.npm-global/bin/ng new testApp'
#end

# .NET Core 2.0 installation.
apt_repository 'dot_net_core2' do
  uri 'https://packages.microsoft.com/repos/microsoft-ubuntu-xenial-prod'
  arch 'amd64'
  distribution 'xenial'
  components ['main']
  key 'https://packages.microsoft.com/keys/microsoft.asc'
  action :add
end
execute 'apt_update' do
  command 'apt-get update'
end
apt_package 'dotnet-sdk-2.1.4'

# Build and run project.
execute 'run_npm_install' do
  command 'npm install'
  cwd '/home/vagrant/CarPoolApp/CarPoolApp'
end
#execute 'run_dotnet_build' do
#  command 'dotnet build --no-incremental'
#  cwd '/home/vagrant/CarPoolApp/CarPoolApp'
#end
execute 'publish_dotnet' do
  command 'dotnet publish --configuration Release --output bin -r linux-x64'
  cwd '/home/vagrant/CarPoolApp/CarPoolApp'
end

# Run app as a service.
cookbook_file '/etc/systemd/system/kestrel-carpoolapp.service' do
  source 'carpoolapp-service'
  action :create
end
systemd_unit 'kestrel-carpoolapp.service' do
  action :start
end

# MS SQL server installation.
apt_repository 'ms_sql_server' do
  uri 'https://packages.microsoft.com/ubuntu/16.04/mssql-server-2017'
  arch 'amd64'
  distribution 'xenial'
  components ['main']
  key 'https://packages.microsoft.com/keys/microsoft.asc'
  action :add
end
execute 'apt_update' do
  command 'apt-get update'
end
apt_package 'mssql-server'

