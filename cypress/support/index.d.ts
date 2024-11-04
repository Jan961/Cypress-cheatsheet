declare namespace Cypress {
    interface Chainable<Subject = any> {
        LoginAPI(): void

        console(method: any): any
    }
}