"""Add status field to client contacts

Revision ID: a1b2c3d4e5f6
Revises: f28b4d7a0da2
Create Date: 2025-12-30 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'f28b4d7a0da2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add status column with default value 'pending'
    op.add_column('client_contacts_information',
                  sa.Column('status', sqlmodel.sql.sqltypes.AutoString(length=50),
                           nullable=False, server_default='pending'))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove status column
    op.drop_column('client_contacts_information', 'status')
