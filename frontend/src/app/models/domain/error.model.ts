export class BackendError {
    constructor(
        public warnings?: string[],
        public errors?: string[],
        public frontErrors?: string[]
    ) { }
}