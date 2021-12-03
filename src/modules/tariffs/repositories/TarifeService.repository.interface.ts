import { CreateTariffsRepositoryDTO } from "../dtos/repositories/CreateTarifs.repository.dto";
import { TarifeService } from "../infra/typeorm/entities/TariffsServices";

export interface TariffsServicesRepositoryInterface {
  create(data: CreateTariffsRepositoryDTO): Promise<TarifeService>;
  getSpecificsTariffs(type: string): Promise<TarifeService[]>;
  getAllTariffs(): Promise<TarifeService[]>;
}
