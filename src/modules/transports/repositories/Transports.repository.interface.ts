import {
  CreateAppointmentsTransportsRepositoryDTO,
  CreateTransportsRepositoryDTO,
} from "@modules/transports/dtos";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

import { CreateProviderTransportTypesDTO } from "../dtos/repositories/CreateProviderTransportTypes.repository.dto";
import { DisableProviderTransportTypeRepositoryDTO } from "../dtos/repositories/DisableProviderTransportType.repository.dto";
import { TransportType } from "../infra/typeorm/entities/TransportType";

export interface TransportsRepositoryInterface {
  create(data: CreateTransportsRepositoryDTO): Promise<Transport>;
  createAppointmentsTransport(
    data: CreateAppointmentsTransportsRepositoryDTO
  ): Promise<void>;
  findById(id: string): Promise<Transport>;
  createTransportType(): Promise<TransportType[]>;
  disableTransportType(): Promise<TransportType[]>;
  getAllByActiveTransportType(active: boolean): Promise<TransportType[]>;
}
