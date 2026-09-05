Rails.application.routes.draw do
  get "/up", to: proc { [200, {}, ["ok"]] }

  namespace :api do
    namespace :v1 do
      post "auth/entrar",   to: "auth#entrar"     # login por convite ou apelido+senha
      post "auth/resgatar", to: "auth#resgatar"   # criar conta com codigo de convite
      get  "auth/eu",       to: "auth#eu"         # dados do usuario logado

      get   "feed",             to: "posts#index"
      post  "posts",            to: "posts#create"
      delete "posts/:id",       to: "posts#destroy"
      post  "posts/:id/reagir",   to: "reacoes#toggle"
      post  "posts/:id/salvar",   to: "salvamentos#toggle"
      get   "salvos",             to: "salvamentos#index"
      post  "posts/:id/denunciar", to: "denuncias#create"

      get  "posts/:post_id/comentarios", to: "comentarios#index"
      post "posts/:post_id/comentarios", to: "comentarios#create"

      resources :grupos, only: %i[index show create] do
        post "entrar", on: :member
        post "sair",   on: :member
      end

      # desafios, ranking e notificacoes
      post "desafios/:desafio/resultado", to: "desafios#resultado"
      get  "desafios/hoje",               to: "desafios#hoje"
      get  "ranking",                     to: "ranking#index"
      get  "notificacoes",                to: "notificacoes#index"

      # stories
      get    "stories",           to: "stories#index"
      post   "stories",           to: "stories#create"
      post   "stories/:id/visto", to: "stories#visto"
      delete "stories/:id",       to: "stories#destroy"

      # chat
      get  "conversas",              to: "conversas#index"
      post "conversas",              to: "conversas#create"
      get  "conversas/:id/mensagens", to: "conversas#mensagens"
      post "conversas/:id/mensagens", to: "conversas#enviar"

      # social
      post "usuarios/:id/seguir", to: "amizades#seguir"
      get  "busca",               to: "busca#index"

      get "perfil",        to: "perfil#show"
      patch "perfil",      to: "perfil#update"
      get "perfil/:id",    to: "perfil#show"

      # area do responsavel/admin
      namespace :admin do
        get  "denuncias",          to: "denuncias#index"
        patch "denuncias/:id",     to: "denuncias#resolver"
        post "convites",           to: "convites#create"
        get  "convites",           to: "convites#index"
        get  "painel",             to: "painel#show"
      end
    end
  end
end
