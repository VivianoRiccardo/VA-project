import React from 'react';

class Plot extends React.Component {

  constructor(callback, filename) {
    
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    const { match, t } = this.props;

    return (
      <div className="container-fluid">

        <div className="breadcrumb-container">
          <p className="breadcrumb-title">{t('Breadcrumb')}</p> <Breadcrumbs
            mappedRoutes={routes}
            WrapperComponent={(props) => <ol className="breadcrumb" >{props.children}</ol>}
            ActiveLinkComponent={(props) => <li className="breadcrumb-item"><strong>{props.children}</strong></li>}
            LinkComponent={(props) => <li className="breadcrumb-item">{props.children}</li>}
          />
        </div>

        <div className="row">
          <div className="col-3">
            <LeftMenu></LeftMenu>
          </div>
          <div className="col">
            <Loader isLoading={this.props.isLoading}></Loader>
            <Switch>
              <Route path={`${match.path}/anagrafica-home`} component={AnagraficaHome} />
              <Route exact path={`${match.path}/operatore-economico`} component={OperatoreEconomico} />
              <Route path={`${match.path}/operatore-economico/dettaglio`} component={DettaglioOperatoreEconomico} />
              <Route exact path={`${match.path}/operatore-economico-pagante`} component={OperatoreEconomicoPagante} />
              {/*<Route path={`${match.path}/operatore-economico-pagante/dettaglio`} component={DettaglioOperatoreEconomicoPagante} />*/}
              <Route path={`${match.path}/ditta-destinataria`} component={DittaDestinataria} />
              <Route exact path={`${match.path}`} component={AnagraficaHome} />
              <Route component={ErrorPage}></Route>
            </Switch>
            
            <div className="spaziatura-footer"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(AnagraficaDetails)