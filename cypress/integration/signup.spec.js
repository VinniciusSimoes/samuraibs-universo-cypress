
import signupPage from '../support/pages/signup'
describe('cadastro', function () {

  before(function(){
    cy.fixture('signup').then(function(signup){
      this.success = signup.success
      this.email_dup = signup.email_dup
      this.email_inv = signup.email_inv
      this.short_password = signup.short_password
    })
  })

  context('quando o usuario e novato', function(){
    before(function () {
      cy.task('removeUser', this.success.email)  // Essa eh uma forma de sempre remover no banco de dados o email para que possa cadastrar novamente
        .then(function (result) {
          console.log(result)
        })
    })

    it('deve cadastrar com sucesso', function(){
      signupPage.go()
      signupPage.form(this.success)
      signupPage.submit()
      signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
    })

  })


  context('quando o email ja existe', function(){
    before(function(){
      cy.postUser(this.email_dup)
    })

    it('entao nao deve cadastrar o usuario', function(){
      signupPage.go()
      signupPage.form(this.email_dup)
      signupPage.submit()
      signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
    });


  });

  context('quando o email eh incorreto', function(){

    it('deve exibir mensagem de alerta', function(){
      signupPage.go()
      signupPage.form(this.email_inv)
      signupPage.submit()
      signupPage.alert.haveText('Informe um email válido')
    });
  });

  context('quando a senha é muito curta', function(){

    const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

    passwords.forEach(function(p){
      it('não deve cadastrar com a senha: ' + p, function(){

        this.short_password.password = p
        signupPage.go()
        signupPage.form(this.short_password)
        signupPage.submit()
      })
    })

    afterEach(function(){
      signupPage.alert.haveText('Pelo menos 6 caracteres')
    })
  })

  context('quando não preencho nenhum dos campos', function(){
    const alertMessages = [
    'Nome é obrigatório',
    'E-mail é obrigatório',
    'Senha é obrigatória'
  ]

  before(()=> {
    signupPage.go()
    signupPage.submit()
  })

  alertMessages.forEach((alert)=>{
    it('deve exibir '+ alert.toLowerCase(), () => {
      signupPage.alert.haveText(alert)
    });
  })

  });
})
