# config valid only for current version of Capistrano
lock '3.6.1'

set :application, 'grokked'
set :repo_url, 'git@github.com:YeasterEgg/home.git'
set :deploy_to, '/var/www/homepage'
set :log_level, :info
set :keep_releases, 2

role :app, "root@46.101.114.92"
role :web, "root@46.101.114.92"

set :branch, ENV["BRANCH"] || 'master'

set :scm, :git

after :"deploy:finished", :change_ownership do
  on roles(:app) do
    execute "sudo chown -R www-data:www-data #{release_path}/"
    execute "sudo chown yegg:yegg #{release_path}/db/db.json"
  end
end

after :change_ownership, :copy_dotenv do
  on roles(:web) do
    execute "ln -ns #{shared_path}/.env #{current_path}/."
  end
end
