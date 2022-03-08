FROM ruby:2.7.1

RUN groupadd -r transit && useradd --no-log-init -r -g transit transit
USER transit

WORKDIR /home/transit

COPY --chown=transit:transit Gemfile Gemfile.lock ./

RUN bundle install

COPY --chown=transit:transit . .

EXPOSE 9292
CMD [ "rackup", "-o", "0.0.0.0" ]