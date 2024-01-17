import { Hono } from 'hono';
import { cors } from 'hono/cors';

import {checkUrl, getUrlData, checkEmail} from './lib/util';
import { insertAndReturnId , insert } from './lib/dbutil';


type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get("/", (c) => c.text("📮 Hello, this is Mail Box"));
app.use('/c/*', cors());
app.use('/api/*', cors());

app.post('/c/deliver', async (c) => {
  const retObj = {ret: "ERROR", data: null, message: "Error, Internal Server Error"};
  try{
    const visitorIP = c.req.header('CF-Connecting-IP');
    const body = await c.req.json();
    const uuid = body.uuid;
    if (!uuid){
      retObj['message'] = 'uuid is required';
      return c.json(retObj);
    }
    const email = body.email;
    if (!email){
      retObj['message'] = 'email is required';
      return c.json(retObj);
    }
    if (!checkEmail(email)){
      retObj['message'] = 'email is invalid';
      return c.json(retObj);
    }
    const referrer = body.referrer;
    let referrer_path = ''
    let referrer_domain = ''
    if (referrer&&checkUrl(referrer)){
      const referrerData = getUrlData(referrer);
      referrer_domain = referrerData.hostname;
      referrer_path = referrerData.pathname;
    }
    const address  = await c.env.DB.prepare('select id from t_address where uuid = ?').bind(uuid).first();
    if (address){
      const addressId = address.id;
      let emailId;
      const addressEmail = await c.env.DB.prepare('select id, email from t_mail where address_id = ? and email = ?').bind(addressId, email).first();
      if (!addressEmail){
        emailId = await insertAndReturnId(c.env.DB, 'insert into t_mail (address_id, email, referrer_domain, referrer_path, visitor_ip) values(?,?,?,?,?)',
        [addressId, email, referrer_domain, referrer_path, visitorIP]);
      } else {
        emailId = addressEmail.id;
      }
      return c.json({ret: "OK", data: emailId, message: "Deliver Success!"});
    } else{
      retObj['message'] = 'uuid is invalid';
      return c.json(retObj);
    }
  } catch (e) {
    console.error(e);
    return c.json(retObj);
  }
})

app.onError((err, c) => {
	console.error(`${err}`);
	return c.text(err.toString());
});

app.notFound(c => c.text('Not found', 404));
export default app
