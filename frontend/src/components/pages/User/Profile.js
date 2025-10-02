import api from '../../../utils/api'
import {useState, useEffect} from 'react'
import styles from '../User/profile.module.css'
import formStyles from '../../form/Form.module.css'

import Input from '../../form/Input'

/*Hooks*/
import useFlashMessage from '../../../hooks/useFlashMessage.'
import RoundedImage from '../../layout/RoundedImage'




function Profile() {
    const [user,setUser] = useState({})
    const [preview, setPreview] = useState()
    const [token] = useState(localStorage.getItem('token')  || '')
    const {setFlashMessage} = useFlashMessage()

    useEffect(()=>{
        api.get('users/checkUser', { 
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        }).then((response) => {
            setUser(response.data)
        })

    }, [token])

 function onFileChange(e) {
  const file = e.target.files[0]

  if (file) {
    const allowedTypes = ['image/png', 'image/jpeg'] // png e jpg
    if (!allowedTypes.includes(file.type)) {
      setFlashMessage('Por favor, envie apenas imagens PNG ou JPG!', 'error')
      setPreview(null)
      return
    }

    setPreview(file)
    setUser({ ...user, [e.target.name]: file })
  }
}


    function handleChange (e){
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        let msgType = 'success'
    
        const formData = new FormData()
    
        const userFormData = await Object.keys(user).forEach((key) =>
          formData.append(key, user[key]),
        )
    
        formData.append('user', userFormData)
    
        const data = await api
          .patch(`/users/edit/${user._id}`, formData, {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            console.log(response.data)
            return response.data
          })
          .catch((err) => {
            console.log(err)
            msgType = 'error'
            return err.response.data
          })
    
        setFlashMessage(data.message, msgType)
      }
    
    return(
        
        <section>
            <div className={styles.profile_header}>
            <h1>Perfil</h1>
            {(user.image || preview) && (
            <RoundedImage
                src= {preview ? URL.createObjectURL(preview):
                `${process.env.REACT_APP_API}image/users/${user.image}`
                }

                alt ={user.name}
                
               />
            )}
            </div>

            <form onSubmit={handleSubmit} className={formStyles.form_container}>
            <Input 
            text='Imagem'
            type= "file"
            name='image'
            handleOnChange={onFileChange}


            />

            <Input 
            text='E-mail'
            type= "email"
            name='email'
            placeholder='Digite seu E-mail'
            handleOnChange={handleChange}
            value={user.email || ''}


            />


            <Input 
            text='name'
            type= "text"
            name='name'
            placeholder='Digite seu Nome'
            handleOnChange={handleChange}
            value={user.name || ''}


            />


            
            <Input 
            text='Telefone'
            type= "text"
            name='phone'
            placeholder='Digite seu Telefone'
            handleOnChange={handleChange}
            value={user.phone || ''}


            />


            <Input 
            text='Senha'
            type= "password"
            name='password'
            placeholder='Digite sua senha'
            handleOnChange={handleChange}
          
            />

<Input 
            text='Confirmar senha'
            type= "password"
            name='confirmpassword'
            placeholder='confirme sua senha'
            handleOnChange={handleChange}
          
            />

        <input type='submit' value='enviar' /> 



            </form>




        </section>
    )
}

export default Profile