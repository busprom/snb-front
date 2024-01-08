import { getUser } from "../../lib/getUser";
import { strapi } from '../../lib/strapi';


export default async (req, res) => {
  const init = await getUser(req?.headers.cookie, res);
  if(!init.id) return res.status(400).json({});

  const {wallet, type} = req.body;

  let user = await strapi('/tottoris/'+init.id, {
    data: {
      [type]: wallet
    }
  }, 'PUT');
  if(!user?.data) return res.status(400).json({});

  user = {id: user.data.id, ...user.data.attributes};

  if(user.location) delete(user.location);
  
  return res.status(200).json(user);
}