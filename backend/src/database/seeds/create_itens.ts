import Knex from 'knex'

export async function seed(Knex: Knex) {
   await Knex('items').insert([
        { title: 'Lampadas', image: 'Lampadas.svg' }, 
        { title: 'Pilhas e baterias', image: 'baterias.svg' }, 
        { title: 'Papeis e Papelao', image: 'papeis-papelao.svg' }, 
        { title: 'Residuos Organicos', image: 'organicos.svg' },
        { title: 'Residuos Eletronicos', image: 'eletronicos.svg' },
        { title: 'Oleo de Cozinha', image: 'oleo.svg' }, 
    ]);
}