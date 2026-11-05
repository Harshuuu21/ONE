import { IAAProvider } from '../interfaces/aa-provider.interface.js';
import { MockAAProvider } from './mock.provider.js';
import { SetuAAProvider } from './setu.provider.js';
import { OneMoneyAAProvider } from './onemoney.provider.js';
import { BadRequestError } from '../../../../shared/errors/index.js';
import { AAProviderMetadata } from '../../types/index.js';

export class AAProviderFactory {
  private static providers: Map<string, IAAProvider> = new Map<string, IAAProvider>([
    ['SAHAMATI_MOCK', new MockAAProvider()],
    ['SETU', new SetuAAProvider()],
    ['ONEMONEY', new OneMoneyAAProvider()],
  ]);

  /**
   * Retrieves all supported, documented AA providers
   */
  static listSupportedProviders(): AAProviderMetadata[] {
    return Array.from(this.providers.values()).map((p) => p.getMetadata());
  }

  /**
   * Resolves a provider adapter instance by providerId
   */
  static getProvider(providerId: string): IAAProvider {
    const normalized = providerId.toUpperCase().trim();
    const provider = this.providers.get(normalized);
    if (!provider) {
      throw new BadRequestError(`Unsupported Account Aggregator provider: ${providerId}`);
    }
    return provider;
  }
}
