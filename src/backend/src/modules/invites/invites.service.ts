import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { Repository } from 'typeorm';
import { KeycloakUser } from '../auth/keycloak-user.model';
import { PiaIntakeService } from '../pia-intake/pia-intake.service';
import { GenerateInviteDto } from './dto/generate-invite.dto';
import { InviteEntity } from './entities/invite.entity';
import { getFormattedInvite, InviteRO } from './ro/get-invite.ro';
import { randomUUID } from 'crypto';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(InviteEntity)
    private inviteRepository: Repository<InviteEntity>,

    @Inject(forwardRef(() => PiaIntakeService))
    private readonly piaService: PiaIntakeService,
  ) {}

  async generate(
    generateInviteDto: GenerateInviteDto,
    user: KeycloakUser,
    userRoles: Array<RolesEnum>,
  ): Promise<InviteRO> {
    // validate access to PIA. Throw error if not
    await this.piaService.validatePiaAccess(
      generateInviteDto.piaId,
      user,
      userRoles,
    );

    // extract user input dto
    const { piaId } = generateInviteDto;

    // return the invite code if already exists
    const existingInvite = await this.inviteRepository.findOne({
      relations: [],
      where: {
        pia: {
          id: piaId,
        },
      },
    });

    // return the formatted invite code if already exists
    if (existingInvite) {
      return getFormattedInvite(existingInvite);
    }

    // else, fetch pia entity and create the invite code
    const pia = await this.piaService.findOneBy({ id: piaId });

    // create Invite code using the inbuilt crypto module that uses a UUID v4 generator
    const inviteCode = randomUUID();

    // create the invite resource
    const invite: InviteEntity = await this.inviteRepository.save({
      pia,
      code: inviteCode,
      createdByGuid: user.idir_user_guid,
      createdByUsername: user.idir_username,
      updatedByGuid: user.idir_user_guid,
      updatedByUsername: user.idir_username,
      createdByDisplayName: user.display_name,
    });

    // return formatted object
    return getFormattedInvite(invite);
  }

  async findOne(piaId: number, code: string) {
    const invite = await this.inviteRepository.findOne({
      relations: [],
      where: {
        pia: {
          id: piaId,
        },
        code,
      },
    });

    return invite;
  }
}
