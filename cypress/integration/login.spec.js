
import loginPage from '../support/pages/login'
import dashPage from '../support/pages/dash'
import login from '../support/pages/login'

describe('login', () => {
    context('quando o usuario é muito bom', () => {

        const user = {
            name: 'Robson Jassa',
            email:'jassa@samuraibs.com',
            password:'pwd123',
            is_provider: true
        }

        before(() => {
            cy.postUser(user)
        })

        it('deve logar com sucesso', () => {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()

            dashPage.header.userLoggedIn(user.name)
        });
    })

    context('quando o usuario é bom mas a senha está incorreta', () => {
        
        let user = {
            name: 'Celso kamura',
            email: 'kamura@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function(){
            cy.postUser(user).then(()=>{
                user.password = 'abc123'
            })
        })
        it('deve notificar erro de credenciais', () => {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()

            const message = 'Ocorreu um erro ao fazer login, verifique suas credenciais.'
            loginPage.toast.shouldHaveText(message)
        });
    })

    context('quando o formato do email eh invalido', () => {
      
        const emails = [
            'papito.com.br',
            'yahoo.com',
            '@gmail.com',
            '@',
            'papito@',
            '111',
            '&*^&^&*',
            'xpto123'
        ]

        before(() => {
            loginPage.go()
        });

        emails.forEach((email)=>{
            it('nao deve loggar com o email: ' + email, () => {
                const user = {email: email, password: 'pwd123'}

                loginPage.form(user)
                loginPage.submit()
                loginPage.alert.haveText('Informe um email válido')
            })
        })
    })

    context('quando não preencho nenhum dos campos', () => {
        const alertMessages = [
        'E-mail é obrigatório',
        'Senha é obrigatória'
      ]
    
      before(()=> {
        loginPage.go()
        loginPage.submit()
      })
    
      alertMessages.forEach((alert)=>{
        it('deve exibir '+ alert.toLowerCase(), () => {
          loginPage.alert.haveText(alert)
        });
      })
    
      })
});