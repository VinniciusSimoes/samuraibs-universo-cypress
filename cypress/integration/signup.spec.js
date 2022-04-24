
import signupPage from '../support/pages/signup'
describe('cadastro', function () {

  context('quando o usuario e novato', function () {
    const user = {
      name: 'Vinnicius Simoes',
      email: 'vinni@samuraibs.com',
      password: 'pwd123'
    }

    before(function () {
      cy.task('removeUser', user.email)  // Essa eh uma forma de sempre remover no banco de dados o email para que possa cadastrar novamente
        .then(function (result) {
          console.log(result)
        })
    })

    it('deve cadastrar com sucesso', () => {
      signupPage.go()
      signupPage.form(user)
      signupPage.submit()
      signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
    })

  })


  context('quando o email ja existe', function () {
    const user = {
      name: 'Cletin tabajara',
      email: 'cleitin@samuraibs.com',
      password: 'pwd123',
      is_provider: true
    }

    before(function () {
      cy.task('removeUser', user.email)  // Essa eh uma forma de sempre remover no banco de dados o email para que possa cadastrar novamente
        .then(function (result) {
          console.log(result)
        })

      cy.request(
        'POST',
        'http://localhost:3333/users',
        user
      ).then(function (response) {
        expect(response.status).to.eq(200)
      })
    })

    it('entao nao deve cadastrar o usuario', () => {
      signupPage.go()
      signupPage.form(user)
      signupPage.submit()
      signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
    });


  });

  context('quando o email eh incorreto', () => {
    const user = {
      name: 'Elizabeth olsen',
      email: 'elizabeth.samuraibs.com',
      password: 'pwd123'
    }

    it('deve exibir mensagem de alerta', () => {
      signupPage.go()
      signupPage.form(user)
      signupPage.submit()
      signupPage.alertHavetext('Informe um email válido')
    });
  });

  context('quando a senha é muito curta', () => {

    const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

    beforeEach(() => {
      signupPage.go()
    });

    passwords.forEach(function (p) {
      it('não deve cadastrar com a senha: ' + p, () => {

        const user = { name: 'Jason Friday', email: 'jason@gmail.com', password: p }

        signupPage.form(user)
        signupPage.submit()
      });
    })

    afterEach(() => {
      signupPage.alertHavetext('Pelo menos 6 caracteres')
    });
  });

  context('quando não preencho nenhum dos campos', () => {
    const alertMessages = [
    'Nome é obrigatório',
    'E-mail é obrigatório',
    'Senha é obrigatória'
  ]

  before(()=> {
    signupPage.go()
    signupPage.submit()
  })

  alertMessages.forEach((a)=>{
    it('deve exibir '+ a.toLowerCase(), () => {
      signupPage.alertHavetext(a)
    });
  })

  });
})
