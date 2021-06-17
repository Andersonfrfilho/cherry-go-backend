import { container } from "tsyringe";

import { JsonWebTokenProvider } from "@shared/container/providers/JwtProvider/implementations/JsonWebTokenProvider";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/JwtProvider.interface";

container.registerSingleton<JwtProviderInterface>(
  "JwtProvider",
  JsonWebTokenProvider
);
