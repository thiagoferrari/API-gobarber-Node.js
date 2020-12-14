/*

PARA DESFAZER TODAS AS MIGRATIONS:
yarn sequelize db:migrate:undo:all

PARA DESFAZER A MIGRATION FEITA:
yarn sequelize db:migrate:undo

*/

/**
 * COLOCAR CONTAINERS NA MÁQUINA:
 * docker run --name mongobarber -p 27017:27017 -d -t 
 * docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11
 */