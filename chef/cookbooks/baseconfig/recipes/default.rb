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

# Reconfigure nginx as reverse proxy for our application.
cookbook_file '/etc/nginx/sites-available/default' do
  source 'nginx-carpoolapp'
  action :create
end
# Restart nginx service to reload config.
service 'nginx' do
  action :restart
end

# nodejs and npm apt repo setup.
execute 'nodejs_repo_script' do
  command 'curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -'
end
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

# .net core 2.0 apt repo setup.
apt_repository 'dot_net_core2' do
  uri 'https://packages.microsoft.com/repos/microsoft-ubuntu-xenial-prod'
  arch 'amd64'
  distribution 'xenial'
  components ['main']
  key 'https://packages.microsoft.com/keys/microsoft.asc'
  action :add
end

# MS SQL server and CLI  apt repo setup.
apt_repository 'ms_sql_server' do
  uri 'https://packages.microsoft.com/ubuntu/16.04/mssql-server-2017'
  arch 'amd64'
  distribution 'xenial'
  components ['main']
  key 'https://packages.microsoft.com/keys/microsoft.asc'
  action :add
end

# Install required packages to run project.
# https://stackoverflow.com/a/42383714
ENV['ACCEPT_EULA'] = 'y'
ENV['DEBIAN_FRONTEND'] = 'noninteractive'
apt_package 'nodejs'
apt_package 'dotnet-sdk-2.1.4'
apt_package 'mssql-server'
apt_package 'mssql-tools'
apt_package 'unixodbc-dev'

# Configure ms sql server - unattended install.
# Placing password here is bad :(
execute 'setup mssql server' do
  command "sudo MSSQL_PID=Developer ACCEPT_EULA=Y MSSQL_SA_PASSWORD='#Password3' /opt/mssql/bin/mssql-conf -n setup"
end

# Build and publish project.
execute 'run_npm_install' do
  command 'npm install'
  cwd '/home/vagrant/CarPoolApp/CarPoolApp'
end
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
execute 'check_app_status' do
  command 'systemctl status kestrel-carpoolapp.service'
  action :nothing
  subscribes :run, 'systemd_unit[kestrel-carpoolapp.service]', :delayed
end

