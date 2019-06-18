import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class BasicAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context)
    let { schema, name } = this.props

    let value = this.getValue()
    let username = value.username

    this.state = {
      name: name,
      schema: schema,
      value: !username ? {} : {
        username: username
      }
    }
  }

  getValue () {
    let { authorized, name } = this.props

    return authorized && authorized.getIn([name, "value"]) || {}
  }

  onChange =(e) => {
    let { onChange } = this.props
    let { value, name } = e.target

    let newValue = this.state.value
    newValue[name] = value

    this.setState({ value: newValue })

    onChange(this.state)
  }

  render() {
    let { schema, getComponent, name, errSelectors } = this.props
    const Input = getComponent("Input")
    const AuthError = getComponent("authError")
    const AuthFormRow = getComponent("AuthFormRow")
    const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent( "Markdown" )
    let username = this.getValue().username
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div>
        <div className="auth__header">
          <h4>
            Basic authorization<JumpToPath path={[ "securityDefinitions", name ]} />
          </h4>
        </div>

        { username && <div className="auth__row">
            <h6>Authorized</h6>
          </div>
        }

        <div className="auth__row">
          <Markdown source={ schema.get("description") } />
        </div>

        {
          username
          ? <div>
              <div className="auth__row">
                <p>Username: <code>{ username }</code></p>
              </div>
              <div className="auth__row">
                <p>Password: <code>******</code></p>
              </div>
            </div>
          : <div>
              <AuthFormRow label="Username:" htmlFor="basic-auth-username">
                <Input id="basic-auth-username" type="text" required="required" name="username" onChange={ this.onChange }/>
              </AuthFormRow>
              <AuthFormRow label="Password:" htmlFor="basic-auth-password">
                <Input id="basic-auth-password" type="password" required="required" name="password" autoComplete="new-password" onChange={ this.onChange }/>
              </AuthFormRow>
            </div>
        }

        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }
      </div>
    )
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    errSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    schema: ImPropTypes.map,
    authorized: ImPropTypes.map
  }
}
