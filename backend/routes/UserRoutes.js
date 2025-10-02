const router = require("express").Router();

const UserController = require("../controllers/UserController")

//middleware
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Users]
 *     description: Cria um novo usuário e retorna o token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João da Silva"
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *               password:
 *                 type: string
 *                 example: "SenhaSegura123"
 *               confirmpassword:
 *                 type: string
 *                 example: "SenhaSegura123"
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - confirmpassword
 *     responses:
 *       '201':
 *         description: Usuário registrado com sucesso e token JWT gerado
 *       '422':
 *         description: Erro de validação (faltando campos ou senha não confere)
 *       '500':
 *         description: Erro interno do servidor
 */
router.post("/register", UserController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Users]
 *     description: Autentica um usuário e retorna o token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 example: "SenhaSegura123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login realizado com sucesso, token JWT retornado
 *       '422':
 *         description: Email ou senha inválidos
 *       '500':
 *         description: Erro interno do servidor
 */
router.post("/login", UserController.login);


/**
 * @swagger
 * /users/checkUser:
 *   get:
 *     summary: Obter usuário autenticado
 *     tags: [Users]
 *     description: Retorna os dados do usuário logado com base no token JWT enviado no cabeçalho.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Retorna o usuário autenticado ou null
 *       '401':
 *         description: Token ausente ou inválido
 */
router.get("/checkUser", UserController.checkUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obter usuário por ID
 *     tags: [Users]
 *     description: Retorna as informações de um usuário específico pelo seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *           example: 64a23c7f8a1234bc9def5678
 *     responses:
 *       '200':
 *         description: Dados do usuário retornados
 *       '422':
 *         description: Usuário não encontrado
 *       '500':
 *         description: Erro interno do servidor
 */
router.get('/:id', UserController.getUserById);

/**
 * @swagger
 * /users/edit/{id}:
 *   patch:
 *     summary: Editar perfil do usuário
 *     tags: [Users]
 *     description: Atualiza os dados do perfil do usuário autenticado. É possível atualizar imagem de perfil e senha.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *           example: 64a23c7f8a1234bc9def5678
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João da Silva"
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *               phone:
 *                 type: string
 *                 example: "11988887777"
 *               password:
 *                 type: string
 *                 example: "NovaSenha123"
 *               confirmpassword:
 *                 type: string
 *                 example: "NovaSenha123"
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - name
 *               - email
 *               - phone
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso
 *       '401':
 *         description: Token JWT inválido ou ausente
 *       '422':
 *         description: Erros de validação (e-mail já existe ou senhas não conferem)
 *       '500':
 *         description: Erro interno do servidor
 */
router.patch('/edit/:id', verifyToken, imageUpload.single("image"), UserController.editUser);


module.exports = router;