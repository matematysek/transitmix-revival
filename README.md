# Transitmix

Transitmix is a sketching tool for transit planners (both professional and armchair) to quickly design routes and share with the public. It lives at [transitmix.net](http://transitmix.net).

## About

### What does this do now?

* You can draw your own routes by dragging and dropping points and it snaps to a street grid.
* You can input stats like headway ("bus comes every X min"), speed (mph), and operating hours.
* It outputs stats like distance of route, # of buses required, and total cost.

### What will this do in the future?

* It will take customizable inputs for layover percentage, cost per revenue hour, annual service days, and perhaps bus capacity.
* It will output round trip / cycle time, revenue hours per day, and estimated ridership
* It will allow users to import custom data for decision making (i.e. census data, residential density, employment density, etc.)

### What does this not do?

* Transitmix is not (yet) a replacement for professional transit operations planning and scheduling.

### Who is this made by?

- [Sam Hashemi](https://github.com/samhashemi)
- [Dan Getelman](https://github.com/dget)
- [Tiffany Chu](https://github.com/tchu88)
- [Danny Whalen](https://github.com/invisiblefunnel)
- [Becky Boone](https://github.com/boonrs)
- [Maksim Pecherskiy](https://github.com/mrmaksimize)

With additional help from [Jason Denizac](https://github.com/jden), [Lyzi Diamond](https://github.com/lyzidiamond), and [Andrew Douglass](https://github.com/ardouglass).

Reach out to all of us at [transitmix@codeforamerica.org](mailto:transitmix@codeforamerica.org).

### How did this project start?

Transitmix was started as a Code for America [hackathon project](https://github.com/tiffani/transit-mix) in January 2013, by the [Atlanta fellowship team](http://willcodeforpeaches.tumblr.com/). It was inspired by a similar project, [Streetmix](http://streetmix.net) and from talks with transit planners.

### How can I help?

* Check out our github issues page [here](https://github.com/codeforamerica/transitmix/issues/).

## Setup

Transitmix is a Ruby application with a PostgreSQL database.

1. [Install PostgreSQL](https://github.com/codeforamerica/howto/blob/master/PostgreSQL.md).
2. [Install Ruby](https://github.com/codeforamerica/howto/blob/master/Ruby.md).

Finally, clone Transmitmix from Github and prepare the database:
   
```console
git clone https://github.com/codeforamerica/transitmix.git
cd transitmix
cp .env.sample .env
bundle install
rake db:create db:migrate
rake db:create db:migrate DATABASE_URL=postgres://localhost/transitmix_test
bundle exec rackup
```

## Deploy to Heroku

```console
heroku create <app name>
heroku addons:add heroku-postgresql
git push heroku master
heroku run rake db:migrate
heroku open
```

## Additional Setup Notes

### Troubleshooting Postgres.app issues

If you have trouble with Postgres.app, make sure you have [your $PATH set correctly](http://postgresapp.com/documentation/).

### Automatic Reloads

To auto-reload after each change:

```
gem install rerun
rerun 'bundle exec rackup'
```

### Developing Under Windows

- Install [Virtual Box](https://www.virtualbox.org/)
- Install [Vagrant](http://www.vagrantup.com/)
- Clone and build a [rails-dev-box](https://github.com/rails/rails-dev-box) vagrant box
- Modify the postgres password to `vagrant` using these [instructions](http://www.postgresql.org/message-id/006201c74b23$17cce130$9b0014ac@wbaus090)
- Modify the .env file with the line `DATABASE_URL=postgres://vagrant:vagrant@localhost/transitmix_development`
- Continue with standard development steps, using your fancy new vagrant box 

### Testing References

* Javascript: [Jasmine](http://jasmine.github.io/)
* Ruby: [RSpec](https://www.relishapp.com/rspec)
