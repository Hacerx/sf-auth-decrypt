/**
 * Represents a Salesforce Org authentication and configuration entry.
 */
export type OrgData = {
  /**
   * OAuth2 access token for authenticating API requests.
   * @example "00DQy00000G9uPF!AQEAQP7apP5pOYWt..."
   */
  accessToken: string;

  /**
   * Base URL of the Salesforce instance.
   * @example "https://dev-ed.develop.my.salesforce.com"
   */
  instanceUrl: string;

  /**
   * Unique Salesforce Organization ID.
   * @example "00DQy00000G9uPFMAZ"
   */
  orgId: string;

  /**
   * Username associated with the Salesforce org.
   * @example "user@example.com"
   */
  username: string;

  /**
   * URL used for logging in to Salesforce.
   * @example "https://login.salesforce.com"
   */
  loginUrl: string;

  /**
   * OAuth2 refresh token used to renew access tokens.
   * @example "5Aep861t2K6ODXFXkGq.fW4pS6RTP9B_U3NI..."
   */
  refreshToken: string;

  /**
   * Client ID used during OAuth2 authentication.
   * Typically "PlatformCLI" for Salesforce CLI.
   * @example "PlatformCLI"
   */
  clientId: string;

  /**
   * Indicates if the org is set as a Dev Hub.
   * @example true
   */
  isDevHub: boolean;

  /**
   * The Salesforce API version being used for the instance.
   * @example "63.0"
   */
  instanceApiVersion: string;

  /**
   * Timestamp of the last API version retrieval.
   * Format: Localized string representation.
   * @example "09/05/2025, 18:53:34"
   */
  instanceApiVersionLastRetrieved: string;

  /**
   * Optional human-readable name for the org.
   * @example "Alpha Components"
   */
  name?: string;

  /**
   * Optional short instance name assigned by Salesforce.
   * @example "SWE42"
   */
  instanceName?: string;

  /**
   * Optional namespace prefix used in managed packages.
   * @example null
   */
  namespacePrefix?: string | null;

  /**
   * Indicates whether the org is a Salesforce Sandbox.
   * @example false
   */
  isSandbox: boolean;

  /**
   * Indicates whether the org is a Scratch Org.
   * @example false
   */
  isScratch: boolean;

  /**
   * Optional expiration date for trial orgs or scratch orgs.
   * Format: YYYY-MM-DD or null.
   * @example null
   */
  trailExpirationDate?: string | null;

  /**
   * Whether the org is configured to track source changes.
   * @example false
   */
  tracksSource: boolean;

  /**
   * (Scratch orgs only) Username of the Dev Hub that created the org.
   * @example "jsolermart@alphacomponents.com"
   */
  devHubUsername?: string;

  /**
   * (Scratch orgs only) Creation timestamp as a string (epoch milliseconds).
   * @example "1732401929000"
   */
  created?: string;

  /**
   * (Scratch orgs only) Date when the org will expire (YYYY-MM-DD).
   * @example "2024-12-23"
   */
  expirationDate?: string;

  /**
   * (Scratch orgs only) Instance identifier for the created org.
   * @example "SWE60S"
   */
  createdOrgInstance?: string;
};
