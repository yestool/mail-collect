drop table if exists t_address;
create table t_address (
  id integer primary key autoincrement,
  name text default '',
  domain text default '',
  forwhat text default '',
  uuid text not null,
  create_at datetime default current_timestamp,
  update_at datetime default current_timestamp
);

insert into t_address (name,domain,forwhat,uuid) values ('test','mailbox.yestool.org','Collect customers willingness to pay','89d3a70b-f6b3-cfd1-e1a6-037a75b46d04');

drop table if exists t_mail;
create table t_mail (
  id integer primary key autoincrement,
  address_id integer not null,
  email text not null,
  referrer_domain text not null,
  referrer_path text not null,
  visitor_ip text not null,
  create_at datetime default current_timestamp,
  update_at datetime default current_timestamp
);