FROM python:3.11-slim

# Install required packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl unzip git sudo libffi-dev libssl-dev gcc && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add 'vscode' user
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd --gid $USER_GID $USERNAME && \
    useradd --uid $USER_UID --gid $USER_GID -m $USERNAME && \
    echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME && \
    chmod 0440 /etc/sudoers.d/$USERNAME

# Install OCI CLI in a virtualenv
RUN python -m venv /opt/oracle-cli && \
    /opt/oracle-cli/bin/pip install --upgrade pip setuptools wheel && \
    /opt/oracle-cli/bin/pip install oci-cli

ENV PATH="/opt/oracle-cli/bin:$PATH"

# Choose the Node version you want
ENV NODE_VERSION=20

RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm

RUN curl -LSs https://raw.githubusercontent.com/fnproject/cli/master/install | sh

RUN apt-get update && apt-get install -y docker.io \
    && groupadd docker || true \
    && usermod -aG docker vscode


# Set default user
USER vscode
