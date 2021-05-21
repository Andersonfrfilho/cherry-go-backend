import { container } from "tsyringe";

import { IJwtProvider } from "@shared/container/providers/JwtProvider/IJwtProvider";
import { JsonWebTokenProvider } from "@shared/container/providers/JwtProvider/implementations/JsonWebTokenProvider";

container.registerSingleton<IJwtProvider>("JwtProvider", JsonWebTokenProvider);
