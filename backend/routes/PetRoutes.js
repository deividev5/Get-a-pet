const router = require('express').Router()

//controller
const PetController =  require("../controllers/PetController")

//helpers
const verifyToken = require("../helpers/verify-token")
const {imageUpload} = require("../helpers/image-upload")
const Pet = require('../models/Pet')


/**
 * @swagger
 * /pets/create:
 *   post:
 *     summary: Cadastrar um novo pet
 *     description: |
 *       Cria um novo pet para adoção.  
 *       É necessário estar autenticado com um **JWT Bearer Token** válido.  
 *       A rota também permite **upload de uma ou mais imagens** do pet.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - weight
 *               - color
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do pet
 *                 example: Rex
 *               age:
 *                 type: integer
 *                 description: Idade do pet (em anos)
 *                 example: 2
 *               description:
 *                 type: string
 *                 description: Descrição do pet
 *                 example: "Cachorro dócil, vacinado e adestrado."
 *               weight:
 *                 type: number
 *                 description: Peso do pet (em kg)
 *                 example: 10.5
 *               color:
 *                 type: string
 *                 description: Cor do pet
 *                 example: "Marrom"
 *               images:
 *                 type: array
 *                 description: Imagens do pet
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '201':
 *         description: Pet cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pet cadastrado com sucesso!
 *                 newPet:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64a23c7f8a1234bc9def5678"
 *                     name:
 *                       type: string
 *                       example: Rex
 *                     age:
 *                       type: integer
 *                       example: 2
 *                     description:
 *                       type: string
 *                       example: "Cachorro dócil, vacinado e adestrado."
 *                     weight:
 *                       type: number
 *                       example: 10.5
 *                     color:
 *                       type: string
 *                       example: "Marrom"
 *                     available:
 *                       type: boolean
 *                       example: true
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "rex1.jpg"
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "64a2bcd456ef1234bc9d0000"
 *                         name:
 *                           type: string
 *                           example: "João Silva"
 *                         image:
 *                           type: string
 *                           example: "avatar.jpg"
 *                         phone:
 *                           type: string
 *                           example: "(11) 99999-9999"
 *       '422':
 *         description: Dados obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "O nome é obrigatório!"
 *       '401':
 *         description: Token JWT inválido ou ausente
 *       '500':
 *         description: Erro interno do servidor
 */
router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Listar todos os pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de pets retornada com sucesso
 */
router.get('/', PetController.getAll)

/**
 * @swagger
 * /pets/mypets:
 *   get:
 *     summary: Listar pets do usuário autenticado
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista dos pets do usuário
 */
router.get('/mypets', verifyToken, PetController.getAllUserPets)

/**
 * @swagger
 * /pets/myadoptions:
 *   get:
 *     summary: Listar adoções do usuário autenticado
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de adoções do usuário
 */
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Obter detalhes de um pet
 *     description: Retorna um pet específico a partir do **ID** informado.
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet
 *         schema:
 *           type: string
 *           example: 64a23c7f8a1234bc9def5678
 *     responses:
 *       '200':
 *         description: Pet encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pet:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64a23c7f8a1234bc9def5678"
 *                     name:
 *                       type: string
 *                       example: Rex
 *                     age:
 *                       type: integer
 *                       example: 3
 *                     description:
 *                       type: string
 *                       example: "Cachorro dócil e vacinado"
 *                     weight:
 *                       type: number
 *                       example: 12.5
 *                     color:
 *                       type: string
 *                       example: "Preto"
 *                     available:
 *                       type: boolean
 *                       example: true
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "rex1.jpg"
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "64a2bcd456ef1234bc9d0000"
 *                         name:
 *                           type: string
 *                           example: "Maria Silva"
 *                         phone:
 *                           type: string
 *                           example: "(11) 99999-9999"
 *       '422':
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID inválido"
 *       '404':
 *         description: Pet não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pet não encontrado"
 *       '500':
 *         description: Erro interno do servidor
 */
router.get('/:id', PetController.getPetById)

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Remover um pet
 *     description: |
 *       Remove um pet existente a partir do **ID** informado.  
 *       Apenas o usuário que cadastrou o pet pode removê-lo.  
 *       É necessário fornecer um **JWT Bearer Token** válido.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser removido
 *         schema:
 *           type: string
 *           example: 64a23c7f8a1234bc9def5678
 *     responses:
 *       '200':
 *         description: Pet removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pet removido com sucesso!"
 *       '401':
 *         description: Token JWT inválido ou ausente
 *       '422':
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID inválido!"
 *       '404':
 *         description: Pet não encontrado ou usuário sem permissão
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pet não encontrado!"
 *       '500':
 *         description: Erro interno do servidor
 */
router.delete('/:id', verifyToken, PetController.removePetById)


/**
 * @swagger
 * /pets/{id}:
 *   patch:
 *     summary: Atualizar informações de um pet
 *     description: |
 *       Atualiza os dados de um pet existente.  
 *       Apenas o **usuário que cadastrou o pet** pode editá-lo.  
 *       É necessário enviar um **JWT Bearer Token** válido e os campos obrigatórios.  
 *       É possível também enviar **novas imagens** do pet.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser atualizado
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
 *                 example: Rex
 *               age:
 *                 type: integer
 *                 example: 3
 *               weight:
 *                 type: number
 *                 example: 12.5
 *               color:
 *                 type: string
 *                 example: Marrom
 *               available:
 *                 type: boolean
 *                 example: true
 *               description:
 *                 type: string
 *                 example: "Cachorro dócil, vacinado e castrado."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - name
 *               - age
 *               - weight
 *               - color
 *               - available
 *     responses:
 *       '200':
 *         description: Pet atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pet:
 *                   type: object
 *                   description: Objeto do pet atualizado
 *                 message:
 *                   type: string
 *                   example: "Pet atualizado com sucesso!"
 *       '401':
 *         description: Token JWT inválido ou ausente
 *       '422':
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "O nome é obrigatório!"
 *       '404':
 *         description: Pet não encontrado ou usuário não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pet não encontrado!"
 *       '500':
 *         description: Erro interno do servidor
 */
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)


/**
 * @swagger
 * /pets/schedule/{id}:
 *   patch:
 *     summary: Agendar visita para conhecer/adotar um pet
 *     description: |
 *       Permite que um **usuário autenticado** agende uma visita para conhecer um pet disponível.  
 *       Não é permitido agendar visita para o próprio pet nem duplicar o agendamento para o mesmo usuário.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser agendado para visita
 *         schema:
 *           type: string
 *           example: 64a23c7f8a1234bc9def5678
 *     responses:
 *       '200':
 *         description: Visita agendada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A visita foi agendada com sucesso, entre em contato com João no telefone: 99999-9999"
 *       '401':
 *         description: Token JWT inválido ou ausente
 *       '404':
 *         description: Pet não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pet não encontrado!"
 *       '422':
 *         description: Tentativa inválida de agendamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     agendarProprioPet:
 *                       value: "Você não pode agendar uma visita com seu próprio Pet!"
 *                     jaAgendado:
 *                       value: "Você já agendou uma visita para este Pet!"
 *       '500':
 *         description: Erro interno do servidor
 */
router.patch('/schedule/:id', verifyToken, PetController.schedule)


/**
 * @swagger
 * /pets/conclude/{id}:
 *   patch:
 *     summary: Concluir adoção de um pet
 *     description: |
 *       Finaliza o ciclo de adoção do pet, marcando-o como **indisponível (`available: false`)**.  
 *       Apenas usuários autenticados podem realizar esta operação.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet que terá a adoção concluída
 *         schema:
 *           type: string
 *           example: 64a23c7f8a1234bc9def5678
 *     responses:
 *       '200':
 *         description: Adoção concluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pet:
 *                   type: object
 *                   description: Pet atualizado (agora com available = false)
 *                 message:
 *                   type: string
 *                   example: "Parabéns! O ciclo de adoção foi finalizado com sucesso!"
 *       '401':
 *         description: Token JWT inválido ou ausente
 *       '404':
 *         description: Pet não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pet não encontrado!"
 *       '500':
 *         description: Erro interno do servidor
 */
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)



module.exports = router