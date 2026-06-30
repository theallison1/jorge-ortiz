const express = require('express');
const router = express.Router();
// Si usás JWT para firmar tokens seguros, usás una clave secreta
const jwt = require('jsonwebtoken'); 

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // 🔒 AQUÍ CONFIGURÁS TU USUARIO Y CONTRASEÑA POR DEFECTO
  if (email === 'admin@ortiz.com' && password === 'ortiz2026') {
    
    // Generamos un token que dura 7 días
    const token = jwt.sign(
      { user: 'admin' }, 
      process.env.JWT_SECRET || 'clave_secreta_temporal', 
      { expiresIn: '7d' }
    );

    return res.json({ token, message: "¡Ingreso exitoso!" });
  }

  // Si los datos están mal, rebota con error
  return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
});

module.exports = router;