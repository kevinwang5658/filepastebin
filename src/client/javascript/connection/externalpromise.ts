export class ExternalPromise<T> {

    public resolve;
    public reject;

    public promise: Promise<T> = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
    })

}