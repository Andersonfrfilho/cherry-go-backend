import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

import { AddressesFactory } from "../factories";
import { TransportsFactory } from "../factories/TransportsFactory";

export class CreateTransports1621140701462 implements MigrationInterface {
  public async up(): Promise<void> {
    // const transports_factory = new TransportsFactory();
    // const appointments = (await getConnection("seeds")
    //   .getRepository("appointments")
    //   .find()) as Appointment[];
    // const transport_type_factory_list = transports_factory.generate({
    //   quantity: appointments.length,
    // });
    // const transports_types = (await getConnection("seeds")
    //   .getRepository("transports_types")
    //   .find()) as TransportType[];
    // const transports_transport_types_list = transport_type_factory_list.map(
    //   (transport) => ({
    //     ...transport,
    //     transport_type_id:
    //       transports_types[
    //         faker.datatype.number({ min: 0, max: transports_types.length - 1 })
    //       ],
    //   })
    // );
    // const addresses_factory = new AddressesFactory();
    // const addresses_origins_factory = addresses_factory.generate({
    //   quantity: transports_transport_types_list.length,
    // });
    // const addresses_origins_saved = await getConnection("seeds")
    //   .getRepository("addresses")
    //   .save(addresses_origins_factory);
    // const addresses_origins_list = (await getConnection("seeds")
    //   .getRepository("addresses")
    //   .find(addresses_origins_saved)) as Address[];
    // const transports_address_origins_list = transports_transport_types_list.map(
    //   (transport, index) => ({
    //     ...transport,
    //     origin_address_id: addresses_origins_list[index].id,
    //   })
    // );
    // const addresses_destinations_factory = addresses_factory.generate({
    //   quantity: transports_address_origins_list.length,
    // });
    // const addresses_destinations_saved = await getConnection("seeds")
    //   .getRepository("addresses")
    //   .save(addresses_destinations_factory);
    // const addresses_destinations_list = (await getConnection("seeds")
    //   .getRepository("addresses")
    //   .find(addresses_destinations_saved)) as Address[];
    // const transports_addresses_destinations_list = transports_address_origins_list.map(
    //   (transport, index) => ({
    //     ...transport,
    //     destination_address_id: addresses_destinations_list[index].id,
    //   })
    // );
    // const transports_saved = await getConnection("seeds")
    //   .getRepository("transports")
    //   .save(transports_addresses_destinations_list);
    // const transports = await getConnection("seeds")
    //   .getRepository("transports")
    //   .find(transports_saved);
    // const appointments_transports = appointments.map((appointment, index) => ({
    //   ...appointment,
    //   transports: [transports[index]],
    // }));
    // await getConnection("seeds")
    //   .getRepository(Appointment)
    //   .save(appointments_transports);
  }

  public async down(): Promise<void> {
    // await getConnection("seeds")
    //   .getRepository("appointments_transports")
    //   .delete({});
    // await getConnection("seeds").getRepository("transports").delete({});
  }
}
