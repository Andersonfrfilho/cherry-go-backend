import {
  CreateAppointmentsTransportsRepositoryDTO,
  CreateTransportsRepositoryDTO,
} from "@modules/transports/dtos";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

export interface TransportsRepositoryInterface {
  create(data: CreateTransportsRepositoryDTO): Promise<Transport>;
  createAppointmentsTransport(
    data: CreateAppointmentsTransportsRepositoryDTO
  ): Promise<void>;
  findById(id: string): Promise<Transport>;
}
