export const removeElementByIndex = <T>(array: T[], index: number) => {
    const isValidIndex = index >= 0 && index < array.length;

    if (!isValidIndex) {
        throw 'Invalid index when removing by array element.';
    }

    const item = array[index];
    array.splice(index, 1);

    return item;
};

export const removeElement = <T>(array: T[], element: T) => {
    const index = array.indexOf(element);
    return removeElementByIndex(array, index);
};
