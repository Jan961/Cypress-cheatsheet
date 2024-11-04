
export const scrollUntilElementIsVisible = (
    rowSelector:string,
    targetRowSelector:string,
    maxScrolls: number = 10) => {
    let scrollCount = 0;

    function scrollAndCheck() {
        scrollCount++;

        cy.get(rowSelector).last().scrollIntoView();

        cy.wait(1000);

        cy.get('body').then(($body) => {
            if ($body.find(targetRowSelector).length > 0) {
                cy.get(targetRowSelector).should('be.visible');
            } else if (scrollCount < maxScrolls) {

                scrollAndCheck();
            } else {
                throw new Error(`Element '${targetRowSelector}' not found after ${maxScrolls} scroll attempts`);
            }
        });
    }

    scrollAndCheck();
}





// This assumes that the previously loaded items are removed from the DOM when new items are loaded
export const  iterateLazyLoadedList = (
    itemSelector:string,
    processItemCallback: CallableFunction,
    maxScrolls = 10) => {

    let previousLastItemIdentifier = '';
    let scrollCount = 0;

    function scrollAndProcess() {

        if (scrollCount >= maxScrolls) {
            cy.log('Max scrolls reached');
            return;
        }

        cy.get(itemSelector).then($items => {
            const itemsCount = $items.length;
            cy.log("itemsCount: ", itemsCount);
            const currentLastItemIdentifier = $items.last().text();
            cy.log("currentLastItemIdentifier: ", currentLastItemIdentifier);

            if (currentLastItemIdentifier !== previousLastItemIdentifier) {

                cy.log("Processing new items");
                for (let i = 0; i < itemsCount; i++) {
                    cy.log("Processing item: ", i);
                    const $item = $items.eq(i);

                    processItemCallback($item);
                }

                previousLastItemIdentifier = currentLastItemIdentifier;

                cy.get(itemSelector).last().scrollIntoView()
                scrollCount++;
                cy.wait(700)
                    .then(() => {
                        scrollAndProcess();
                    });
            } else {

                cy.log('No more items to load');
            }
        });
    }

// Start the recursive scrolling and processing
    scrollAndProcess();
}