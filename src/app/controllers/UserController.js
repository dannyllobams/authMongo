import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const shape = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await shape.isValid(req.body)))
      return res.status(400).send({ error: 'Validation failed' });

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).send({ error: 'User already exists.' });

    const { id } = await User.create({
      name,
      email,
      password,
    });

    return res.send({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const shape = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      oldPassword: Yup.string().when('password', (password, field) =>
        password ? field.required() : field
      ),
      password: Yup.string().min(6),
      checkPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await shape.isValid(req.body)))
      return res.status(400).send({ error: 'Validation failed' });

    const { name, email, oldPassword } = req.body;

    const user = await User.findById(req.userId);

    if (user.email !== email) {
      const userExists = await User.findOne({ email });

      if (userExists)
        return res.status(400).send({ error: 'User already exists' });
    }

    if (oldPassword) {
      if (user.password !== oldPassword)
        return res.status(401).send({ error: 'Old password invalid' });
    }

    const { id } = await user.updateOne(req.body);

    return res.send({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
