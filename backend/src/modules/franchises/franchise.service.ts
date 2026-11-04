import type { IFranchiseRepository, Franchise } from "./franchise.repository.js"

export class FranchiseService {

    constructor(private repository: IFranchiseRepository) { }
    //We dont use async function here because we are not doing any async operations, 
    // we are just returning the promise from the repository, find all already returns a promise
    getAllFranchises(): Promise<Franchise[]> {
        return this.repository.findAll();
    }
}

export default FranchiseService;