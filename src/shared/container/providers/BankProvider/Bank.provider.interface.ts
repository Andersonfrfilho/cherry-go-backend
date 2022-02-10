import { GeneratedIbanCodeParams } from "./dtos/GeneratedIbanCodeParams.dto";
import { Bank } from "./dtos/GetAll.dto";

export interface BankProviderInterface {
  getAll(): Promise<Bank[]>;
  generatedIbanCode(data: GeneratedIbanCodeParams): string;
}
