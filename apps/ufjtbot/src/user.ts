import { Octokit } from '@octokit/core';
import { createOAuthUserAuth } from '@octokit/auth-oauth-app';
import { InferIdType, WithId } from 'mongodb';
import { octokit } from './global.js';
import { createUser } from './requests.js';
import { UfjtUser } from './types';

export default class User {
  sName: string;
  sId: string;
  tId: string;
  gId?: number;
  gUrl?: string;
  gName?: string;
  _id?: InferIdType<UfjtUser>;

  constructor({ sName, sId, tId }: Pick<UfjtUser, 'sId' | 'sName' | 'tId'>) {
    this.sName = sName;
    this.sId = sId;
    this.tId = tId;
  }

  /**
   * handle octokit auth strategies for oauth-user
   * @param code
   */
  authOauthUser = async (code: string) => {
    let data;
    const oauthUserOctokit = await octokit.auth({
      type: 'oauth-user',
      code,
      factory: (options: () => void) => {
        return new Octokit({
          authStrategy: createOAuthUserAuth,
          auth: options
        });
      }
    }) as Octokit;

    try {
      const user = await oauthUserOctokit.request('GET /user');
      data = user.data;
      this.gId = data.id;
      this.gName = data.login;
      this.gUrl = data.html_url;
    } catch (err) {
      data = null;
    }

    return data;
  };

  /**
   * insert user to tb
   */
  async save() {
    const { gId, gName, sName, sId, gUrl, tId } = this;
    if (!gId || !gName || !gUrl) {
      return;
    }

    const user = await createUser({ gId, gName, sName, sId, gUrl, tId }) as WithId<UfjtUser>;
    this._id = user._id;
  }

  /**
   * GET all data properties
   */
  // eslint-disable-next-line complexity
  getCurrentData = (): WithId<UfjtUser> | Pick<UfjtUser, 'sName' | 'sId' | 'tId'> => {
    const { gId, gName, sName, sId, gUrl, tId, _id } = this;
    if (!gId || !gName || !gUrl || !_id) {
      return { sName, sId, tId };
    }
    return { gId, gName, sName, sId, gUrl, tId, _id };
  };
}