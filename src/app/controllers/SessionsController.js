import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import SHA256 from '@pozible/meteor-sha';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionsController {
  async store(req, res) {
    try {
      const {
        email,
        password
      } = req.body;
      const user = await User.findOne({
        "emails.address": email.toLowerCase()
      }).select('+services.password');
      if (!user) {
        return res.status(401).json({
          error: true,
          message: 'Usuário não encontrado. Verifique se o e-mail digitado está correto e tente novamente.'
        });
      }
      const databasePassword = user.services.password.bcrypt ?? user.services.password;
      const newPassword = SHA256(password);
      //Valida se a senha está correta
      if (!(await bcrypt.compare(newPassword, databasePassword))) {
        console.log('senha incorreta');
        return res.status(401).json({
          error: true,
          message: 'A senha digitada está incorreta. Tente novamente ou recupere a sua senha.'
        });
      }

      //Gera token
      const token = jwt.sign({
        id: user._id
      }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })

      //Remove campos desnecessários
      user.services = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;

      return res.status(200).json({
        profile: { name: user.profile.name ? user.profile.name : 'Nome do Cliente' },
        email: user.emails[0].address,
        token: token,
        id: user._id
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Ops! Ocorreu um erro em nosso servidor. Por favor, tente novamente ou contate o supo.'
      });
    }
  }
}

export default new SessionsController();