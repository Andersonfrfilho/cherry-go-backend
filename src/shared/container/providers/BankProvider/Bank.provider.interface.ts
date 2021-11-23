import { GeneratedIbanCodeParams } from "./dtos/GeneratedIbanCodeParams.dto";
import { Bank } from "./dtos/GetAll.dto";

export interface BankProviderInterface {
  getAll(): Promise<Bank[]>;
  generatedIbanCode(data: GeneratedIbanCodeParams): string;
}

// const alsoHuge = BigInt('90400888000090010790877121112700') % 97n
// console.log(98n - alsoHuge)
