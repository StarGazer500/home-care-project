"""increase message and service_needed field lengths

Revision ID: ede8f3922620
Revises: e2e54d3dc202
Create Date: 2025-12-29 08:12:49.535074

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'ede8f3922620'
down_revision: Union[str, Sequence[str], None] = 'e2e54d3dc202'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Increase service_needed from VARCHAR(20) to VARCHAR(100)
    op.alter_column('client_contacts_information', 'service_needed',
                    existing_type=sa.VARCHAR(length=20),
                    type_=sa.VARCHAR(length=100),
                    existing_nullable=True)

    # Increase message from VARCHAR(20) to VARCHAR(1000)
    op.alter_column('client_contacts_information', 'message',
                    existing_type=sa.VARCHAR(length=20),
                    type_=sa.VARCHAR(length=1000),
                    existing_nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    # Revert message from VARCHAR(1000) to VARCHAR(20)
    op.alter_column('client_contacts_information', 'message',
                    existing_type=sa.VARCHAR(length=1000),
                    type_=sa.VARCHAR(length=20),
                    existing_nullable=True)

    # Revert service_needed from VARCHAR(100) to VARCHAR(20)
    op.alter_column('client_contacts_information', 'service_needed',
                    existing_type=sa.VARCHAR(length=100),
                    type_=sa.VARCHAR(length=20),
                    existing_nullable=True)
