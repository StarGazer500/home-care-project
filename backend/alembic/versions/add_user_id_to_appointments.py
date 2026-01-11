"""add user_id to appointments

Revision ID: add_user_id_to_appointments
Revises: a1b2c3d4e5f6
Create Date: 2026-01-11 00:20:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_user_id_to_appointments'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    # Add user_id column to appointments table
    op.add_column('appointments', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_appointments_user_id',
        'appointments', 'users',
        ['user_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade():
    # Drop foreign key and column
    op.drop_constraint('fk_appointments_user_id', 'appointments', type_='foreignkey')
    op.drop_column('appointments', 'user_id')
