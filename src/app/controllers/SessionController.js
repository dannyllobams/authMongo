import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const shape = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await shape.isValid(req.body)))
      return res.status(400).send({ error: 'Validation failed' });

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(401).send({ error: 'Invalid user' });

    if (password !== user.password)
      return res.status(401).send({ error: 'Invalid password' });

    const { id, name } = user;

    const token = await jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.send({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }
}

export default new SessionController();
