import { container } from "tsyringe";

import { JsonWebTokenProvider } from "@shared/container/providers/JwtProvider/implementations/JsonWebToken.provider";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";

container.registerSingleton<JwtProviderInterface>(
  "JwtProvider",
  JsonWebTokenProvider
);
